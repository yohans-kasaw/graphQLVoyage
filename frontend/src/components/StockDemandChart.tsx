import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { KPIS_QUERY } from '../graphql/queries';

interface StockDemandChartProps {
  range?: string;
}

interface KPI {
  date: string;
  stock: number;
  demand: number;
}

export function StockDemandChart({ range = '7d' }: StockDemandChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; data: KPI } | null>(null);
  
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
          <p>Error loading chart data: {error.message}</p>
        </div>
      </div>
    );
  }

  const kpis: KPI[] = data?.kpis || [];
  
  if (kpis.length === 0) {
    return (
      <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/30 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Stock vs Demand Trend</h3>
          <p className="text-sm text-gray-600">Daily inventory levels over time</p>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available for the selected range
        </div>
      </div>
    );
  }

  // Chart dimensions
  const width = 600;
  const height = 200;
  const padding = { top: 20, right: 40, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate scales
  const allValues = kpis.flatMap(d => [d.stock, d.demand]);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const valueRange = maxValue - minValue;
  const yScale = (value: number) => chartHeight - ((value - minValue) / valueRange) * chartHeight;
  const xScale = (index: number) => (index / (kpis.length - 1)) * chartWidth;

  // Generate path data
  const createPath = (dataKey: 'stock' | 'demand') => {
    return kpis.map((d, i) => {
      const x = xScale(i);
      const y = yScale(d[dataKey]);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const stockPath = createPath('stock');
  const demandPath = createPath('demand');

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/30 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Stock vs Demand Trend</h3>
        <p className="text-sm text-gray-600">Daily inventory levels over time</p>
      </div>
      
      <div className="relative">
        <svg 
          width="100%" 
          height={height} 
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.5"/>
            </pattern>
          </defs>
          <rect 
            x={padding.left} 
            y={padding.top} 
            width={chartWidth} 
            height={chartHeight} 
            fill="url(#grid)" 
          />

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
            const value = minValue + (valueRange * ratio);
            const y = padding.top + chartHeight - (ratio * chartHeight);
            return (
              <g key={ratio}>
                <line 
                  x1={padding.left - 5} 
                  y1={y} 
                  x2={padding.left} 
                  y2={y} 
                  stroke="#64748b" 
                />
                <text 
                  x={padding.left - 10} 
                  y={y + 4} 
                  textAnchor="end" 
                  fontSize="12" 
                  fill="#64748b"
                >
                  {Math.round(value).toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {kpis.map((d, i) => {
            if (i % Math.ceil(kpis.length / 5) === 0 || i === kpis.length - 1) {
              const x = padding.left + xScale(i);
              return (
                <g key={i}>
                  <line 
                    x1={x} 
                    y1={padding.top + chartHeight} 
                    x2={x} 
                    y2={padding.top + chartHeight + 5} 
                    stroke="#64748b" 
                  />
                  <text 
                    x={x} 
                    y={padding.top + chartHeight + 20} 
                    textAnchor="middle" 
                    fontSize="12" 
                    fill="#64748b"
                  >
                    {formatDate(d.date)}
                  </text>
                </g>
              );
            }
            return null;
          })}

          {/* Chart area */}
          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Stock line */}
            <path
              d={stockPath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Demand line */}
            <path
              d={demandPath}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {kpis.map((d, i) => {
              const x = xScale(i);
              const stockY = yScale(d.stock);
              const demandY = yScale(d.demand);
              
              return (
                <g key={i}>
                  {/* Stock point */}
                  <circle
                    cx={x}
                    cy={stockY}
                    r="4"
                    fill="#3b82f6"
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-6 transition-all"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredPoint({
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                        data: d
                      });
                    }}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  
                  {/* Demand point */}
                  <circle
                    cx={x}
                    cy={demandY}
                    r="4"
                    fill="#8b5cf6"
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-6 transition-all"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredPoint({
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                        data: d
                      });
                    }}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              );
            })}
          </g>
        </svg>

        {/* Tooltip */}
        {hoveredPoint && (
          <div 
            className="absolute z-10 bg-white/95 backdrop-blur-sm border border-white/30 rounded-lg p-3 shadow-lg pointer-events-none"
            style={{
              left: hoveredPoint.x - 100,
              top: hoveredPoint.y - 80,
            }}
          >
            <div className="text-sm font-medium text-gray-900 mb-1">
              {new Date(hoveredPoint.data.date).toLocaleDateString('en-US', { 
                weekday: 'short',
                month: 'short', 
                day: 'numeric'
              })}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Stock: {hoveredPoint.data.stock.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Demand: {hoveredPoint.data.demand.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200/50">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-blue-500"></div>
          <span className="text-sm font-medium text-gray-700">Stock</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-purple-500"></div>
          <span className="text-sm font-medium text-gray-700">Demand</span>
        </div>
      </div>
    </div>
  );
}
