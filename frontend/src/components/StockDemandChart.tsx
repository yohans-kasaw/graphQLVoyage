import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@apollo/client/react';
import { KPIS_QUERY } from '../graphql/queries';

interface StockDemandChartProps {
  range?: string;
}

export function StockDemandChart({ range = '7d' }: StockDemandChartProps) {
  const { data, loading, error } = useQuery(KPIS_QUERY, {
    variables: { range }
  });

  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/30 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-200"></div>
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent absolute top-0"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/30 p-6">
        <div className="text-center text-red-600">
          <p>Error loading chart data</p>
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || [];

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/30 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Stock vs Demand Trend</h3>
        <p className="text-sm text-gray-600">Daily inventory levels over time</p>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={kpis} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                backdropFilter: 'blur(8px)',
                fontSize: '14px'
              }}
              labelFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { 
                  weekday: 'short',
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                });
              }}
              formatter={(value: number, name: string) => [
                value.toLocaleString(),
                name === 'stock' ? 'Stock' : 'Demand'
              ]}
            />
            <Legend 
              wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
            />
            <Line 
              type="monotone" 
              dataKey="stock" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              name="Stock"
            />
            <Line 
              type="monotone" 
              dataKey="demand" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
              name="Demand"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
