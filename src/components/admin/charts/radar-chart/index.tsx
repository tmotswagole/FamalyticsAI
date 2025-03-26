import React from "react";
import {
  ResponsiveContainer,
  Tooltip,
  Legend,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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

// Radar Chart Component for KPI visualization
export const CustomRadarChart = ({
  data,
  dataKeys,
  categoryKey,
  height = 350,
  color = "#2563eb",
  title = "",
  formatter = null,
}: {
  data: Array<Record<string, any>>;
  dataKeys: string[];
  categoryKey: string;
  height?: number;
  color?: string;
  title?: string;
  formatter?: ((value: number) => string | number) | null;
}) => {
  if (!data || data.length === 0 || !dataKeys || dataKeys.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-background rounded-lg border border-border">
        <p className="text-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h4 className="text-sm font-medium text-gray-600 mb-2">{title}</h4>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsRadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey={categoryKey} tick={{ fontSize: 12 }} />
          <PolarRadiusAxis
            tickFormatter={
              formatter
                ? (value: any, index: number) => String(formatter(value))
                : undefined
            }
            tick={{ fontSize: 12 }}
          />
          <Radar
            name="Performance"
            dataKey={dataKeys[0]}
            stroke={color}
            fill={color}
            fillOpacity={0.6}
            isAnimationActive={true}
            animationDuration={750}
          />
          <Tooltip content={<CustomTooltip formatter={formatter} />} />
          <Legend wrapperStyle={{ fontSize: "12px", marginTop: "10px" }} />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export { CustomRadarChart as RechartsRadarChart };
