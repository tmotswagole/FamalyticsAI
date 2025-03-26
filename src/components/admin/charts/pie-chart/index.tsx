import React from "react";
import {
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
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

// Pie Chart Component
export const CustomPieChart = ({
  data,
  nameField,
  valueField,
  height = 300,
  innerRadius = 0,
  colorPalette = [
    "#2563eb",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#0ea5e9",
    "#14b8a6",
    "#f97316",
    "#a855f7",
  ],
  title = "",
  formatter = null,
}: {
  data: Array<Record<string, any>>;
  nameField: string;
  valueField: string;
  height?: number;
  innerRadius?: number;
  colorPalette?: string[];
  title?: string;
  formatter?: ((value: number) => string | number) | null;
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-background rounded-lg border border-border">
        <p className="text-foreground">No data available</p>
      </div>
    );
  }

  // Calculate percentage for each slice
  const total = data.reduce((sum, item) => sum + item[valueField], 0);

  // Explicitly type dataWithPercentage to match the expected structure
  const dataWithPercentage: Array<{
    name: string;
    value: number;
    percentage: string;
  }> = data.map((item) => ({
    name: item[nameField],
    value: item[valueField],
    percentage: ((item[valueField] / total) * 100).toFixed(1),
  }));

  return (
    <div className="w-full">
      {title && (
        <h4 className="text-sm font-medium text-foreground mb-2">{title}</h4>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={dataWithPercentage}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={height / 3}
            innerRadius={innerRadius}
            dataKey={valueField}
            nameKey={nameField}
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            isAnimationActive={true}
            animationDuration={750}
          >
            {dataWithPercentage.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colorPalette[index % colorPalette.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) =>
              formatter ? formatter(value as number) : value
            }
            content={<CustomTooltip formatter={formatter} />}
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ fontSize: "12px", paddingLeft: "10px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export { CustomPieChart as RechartsStyledPieChart };
