import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { GraphQLError } from 'graphql'

const typeDefs = `
  type Warehouse {
    code: ID!
    name: String!
    city: String!
    country: String!
  }

  type Product {
    id: ID!
    name: String!
    sku: String!
    warehouse: String!
    stock: Int!
    demand: Int!
  }

  type KPI {
    date: String!
    stock: Int!
    demand: Int!
  }

  type Query {
    products(search: String, status: String, warehouse: String): [Product!]!
    warehouses: [Warehouse!]!
    kpis(range: String!): [KPI!]!
  }

  type Mutation {
    updateDemand(id: ID!, demand: Int!): Product!
    transferStock(id: ID!, from: String!, to: String!, qty: Int!): Product!
  }
`

type Warehouse = {
    code: string
    name: string
    city: string
    country: string
}

type Product = {
    id: string
    name: string
    sku: string
    warehouse: string
    stock: number
    demand: number
}

type KPI = {
    date: string
    stock: number
    demand: number
}

// Sample data
const warehouses: Warehouse[] = [
    {
        code: 'BLR-A',
        name: 'Bengaluru Alpha',
        city: 'Bengaluru',
        country: 'India',
    },
    { code: 'PNQ-C', name: 'Pune Charlie', city: 'Pune', country: 'India' },
    { code: 'DEL-B', name: 'Delhi Bravo', city: 'New Delhi', country: 'India' },
]

let products: Product[] = [
    {
        id: 'P-1001',
        name: '12mm Hex Bolt',
        sku: 'HEX-12-100',
        warehouse: 'BLR-A',
        stock: 180,
        demand: 120,
    },
    {
        id: 'P-1002',
        name: 'Steel Washer',
        sku: 'WSR-08-500',
        warehouse: 'BLR-A',
        stock: 50,
        demand: 80,
    },
    {
        id: 'P-1003',
        name: 'M8 Nut',
        sku: 'NUT-08-200',
        warehouse: 'PNQ-C',
        stock: 80,
        demand: 80,
    },
    {
        id: 'P-1004',
        name: 'Bearing 608ZZ',
        sku: 'BRG-608-50',
        warehouse: 'DEL-B',
        stock: 24,
        demand: 120,
    },
]

// --- Helpers ---
function statusOf(p: Product): 'shortage' | 'balanced' | 'overstock' {
    if (p.stock < p.demand) return 'shortage'
    if (p.stock > p.demand) return 'overstock'
    return 'balanced'
}

function parseRange(range: string): number {
    const lower = range.toLowerCase()
    if (lower === '7d') return 7
    if (lower === '30d' || lower === '1m') return 30
    if (lower === '90d' || lower === '3m') return 90
    const num = parseInt(lower, 10)
    return Number.isFinite(num) && num > 0 ? num : 7
}

function formatDate(d: Date): string {
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
}

// --- Resolvers ---
const resolvers = {
    Query: {
        products: (
            _: unknown,
            args: { search?: string; status?: string; warehouse?: string },
        ): Product[] => {
            const { search, status, warehouse } = args
            let result = products.slice()

            if (search && search.trim()) {
                const q = search.trim().toLowerCase()
                result = result.filter(
                    (p) =>
                        p.id.toLowerCase().includes(q) ||
                        p.sku.toLowerCase().includes(q) ||
                        p.name.toLowerCase().includes(q),
                )
            }

            if (warehouse && warehouse.trim()) {
                const w = warehouse.trim().toUpperCase()
                result = result.filter((p) => p.warehouse.toUpperCase() === w)
            }

            if (status && status.trim()) {
                const s = status.trim().toLowerCase()
                result = result.filter((p) => statusOf(p) === s)
            }

            return result
        },

        warehouses: (): Warehouse[] => {
            return warehouses
                .slice()
                .sort((a, b) => a.code.localeCompare(b.code))
        },

        kpis: (_: unknown, args: { range: string }): KPI[] => {
            const days = parseRange(args.range)

            const baseStock = products.reduce((sum, p) => sum + p.stock, 0)
            const baseDemand = products.reduce((sum, p) => sum + p.demand, 0)

            const today = new Date()
            const out: KPI[] = []

            // Simple deterministic pseudo-variation over the range
            for (let i = days - 1; i >= 0; i--) {
                const d = new Date(today)
                d.setDate(today.getDate() - i)

                const factorStock = 0.9 + ((i % 7) - 3) * 0.02 // ~ +/-6%
                const factorDemand = 0.9 + (((i + 3) % 7) - 3) * 0.02

                out.push({
                    date: formatDate(d),
                    stock: Math.max(0, Math.round(baseStock * factorStock)),
                    demand: Math.max(0, Math.round(baseDemand * factorDemand)),
                })
            }
            return out
        },
    },

    Mutation: {
        updateDemand: (
            _: unknown,
            args: { id: string; demand: number },
        ): Product => {
            const { id, demand } = args
            if (!Number.isInteger(demand) || demand < 0) {
                throw new GraphQLError('demand must be a non-negative integer')
            }
            const p = products.find((pr) => pr.id === id)
            if (!p) {
                throw new GraphQLError(`Product with id ${id} not found`)
            }
            p.demand = demand
            return p
        },

        transferStock: (
            _: unknown,
            args: { id: string; from: string; to: string; qty: number },
        ): Product => {
            const { id, from, to, qty } = args
            if (!Number.isInteger(qty) || qty <= 0) {
                throw new GraphQLError('qty must be a positive integer')
            }
            const src = products.find(
                (p) => p.id === id && p.warehouse === from,
            )
            if (!src) {
                // As a convenience, also try matching by id alone
                const any = products.find((p) => p.id === id)
                if (!any) {
                    throw new GraphQLError(
                        `Product with id ${id} not found in inventory`,
                    )
                }
                throw new GraphQLError(
                    `Product ${id} is not located in warehouse ${from} (current: ${any.warehouse})`,
                )
            }
            if (qty > src.stock) {
                throw new GraphQLError(
                    `Insufficient stock in ${from}. Requested ${qty}, available ${src.stock}`,
                )
            }

            // Deduct from source
            src.stock -= qty

            // Find or create destination entry for the same product
            let dest = products.find((p) => p.id === id && p.warehouse === to)
            if (!dest) {
                // For simplicity: create a separate row at destination.
                // Note: keeping the same id; in a real system you'd likely use a composite (product+warehouse).
                dest = {
                    id: id,
                    name: src.name,
                    sku: src.sku,
                    warehouse: to,
                    stock: 0,
                    demand: 0, // Start at 0; adjust as needed for your use case
                }
                products.push(dest)
            }

            dest.stock += qty

            return dest
        },
    },
}

// --- Start server ---
async function main() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    })

    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
    })

    console.log(`🚀 Mock GraphQL Server ready at ${url}`)
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
