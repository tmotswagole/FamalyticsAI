import React from "react";
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
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

// Enhanced Line Chart with customization options
export const LineChart = ({
  data,
  xField,
  yField,
  height = 300,
  color = "#2563eb",
  strokeWidth = 2,
  showGrid = true,
  formatter = undefined,
  areaFill = false,
  title = "",
  secondaryYField = null,
  secondaryColor = "#10b981",
}: {
  data: Array<Record<string, any>>;
  xField: string;
  yField: string;
  height?: number;
  color?: string;
  strokeWidth?: number;
  showGrid?: boolean;
  formatter?: ((value: number) => string | number) | undefined;
  areaFill?: boolean;
  title?: string;
  secondaryYField?: string | null;
  secondaryColor?: string;
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
        <RechartsLineChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          <XAxis
            dataKey={xField}
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: "#e5e7eb" }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: "#e5e7eb" }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickFormatter={
              formatter ? (value) => String(formatter(value)) : undefined
            }
          />
          <Tooltip
            content={<CustomTooltip formatter={formatter || undefined} />}
          />
          <Legend wrapperStyle={{ fontSize: "12px", marginTop: "10px" }} />

          <Line
            type="monotone"
            dataKey={yField}
            name={
              yField.charAt(0).toUpperCase() +
              yField.slice(1).replace(/([A-Z])/g, " $1")
            }
            stroke={color}
            strokeWidth={strokeWidth}
            dot={{ r: 3, strokeWidth: 1 }}
            activeDot={{ r: 5, strokeWidth: 1 }}
            isAnimationActive={true}
            animationDuration={750}
          />

          {secondaryYField && (
            <Line
              type="monotone"
              dataKey={secondaryYField}
              name={
                secondaryYField.charAt(0).toUpperCase() +
                secondaryYField.slice(1).replace(/([A-Z])/g, " $1")
              }
              stroke={secondaryColor}
              strokeWidth={strokeWidth}
              dot={{ r: 3, strokeWidth: 1 }}
              activeDot={{ r: 5, strokeWidth: 1 }}
              isAnimationActive={true}
              animationDuration={750}
            />
          )}

          {areaFill && (
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
          )}
          {areaFill && (
            <Area
              type="monotone"
              dataKey={yField}
              fill="url(#colorGradient)"
              fillOpacity={1}
              stroke="none"
            />
          )}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export { RechartsLineChart };
