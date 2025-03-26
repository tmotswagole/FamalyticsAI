import React from "react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart as RechartsBarChart,
  Bar,
} from "recharts";

// Custom tooltip component with better styling
interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  formatter?: ((value: number) => string | number) | null;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  formatter,
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-background p-3 border border-border shadow-md rounded-md">
      <p className="font-medium text-foreground">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color }} className="text-sm">
          {entry.name}: {formatter ? formatter(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
};

// Bar Chart Component
interface BarChartProps {
  data: { [key: string]: any }[];
  xField: string;
  yField: string;
  height?: number;
  color?: string;
  showGrid?: boolean;
  stacked?: boolean;
  horizontal?: boolean;
  formatter?: (value: number) => string | number;
  title?: string;
  barSize?: number;
  multipleData?: string[] | null;
  colorPalette?: string[];
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  xField,
  yField,
  height = 300,
  color = "#2563eb",
  showGrid = true,
  stacked = false,
  horizontal = false,
  formatter = undefined,
  title = "",
  barSize = 20,
  multipleData = null,
  colorPalette = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-background rounded-lg border border-border">
        <p className="text-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h4 className="text-sm font-medium text-foreground mb-2">{title}</h4>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          layout={horizontal ? "vertical" : "horizontal"}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}

          {horizontal ? (
            <>
              <XAxis
                type="number"
                tickFormatter={
                  formatter
                    ? (value: any) => String(formatter(value))
                    : undefined
                }
                tick={{ fontSize: 12 }}
              />
              <YAxis
                dataKey={xField}
                type="category"
                tick={{ fontSize: 12 }}
                width={80}
              />
            </>
          ) : (
            <>
              <XAxis dataKey={xField} tick={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={
                  formatter
                    ? (value: any, index: number) => String(formatter(value))
                    : undefined
                }
                tick={{ fontSize: 12 }}
              />
            </>
          )}

          <Tooltip content={<CustomTooltip formatter={formatter} />} />
          <Legend wrapperStyle={{ fontSize: "12px", marginTop: "10px" }} />

          {multipleData ? (
            // For multiple data series
            multipleData.map((field, index) => (
              <Bar
                key={field}
                dataKey={field}
                name={
                  field.charAt(0).toUpperCase() +
                  field.slice(1).replace(/([A-Z])/g, " $1")
                }
                stackId={stacked ? "stack" : index}
                fill={colorPalette[index % colorPalette.length]}
                barSize={barSize}
                isAnimationActive={true}
                animationDuration={750}
              />
            ))
          ) : (
            // For single data series
            <Bar
              dataKey={yField}
              name={
                yField.charAt(0).toUpperCase() +
                yField.slice(1).replace(/([A-Z])/g, " $1")
              }
              fill={color}
              barSize={barSize}
              isAnimationActive={true}
              animationDuration={750}
            />
          )}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export { RechartsBarChart };
