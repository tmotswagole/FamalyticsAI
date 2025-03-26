// components/Charts/index.tsx
import React from "react";

// Custom tooltip component with better styling
interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  formatter?: ((value: number) => string | number) | null;
}

// Heat Map Component
interface HeatmapProps {
  data: Array<Record<string, any>>;
  xField: string;
  yField: string;
  colorField: string;
  height?: number;
  title?: string;
  colorRange?: string[];
}

export const Heatmap: React.FC<HeatmapProps> = ({
  data,
  xField,
  yField,
  colorField,
  height = 300,
  title = "",
  colorRange = ["#ebf8ff", "#3182ce", "#2c5282"],
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-background rounded-lg border border-border">
        <p className="text-foreground">No data available</p>
      </div>
    );
  }

  // Group data by yField (resources) and xField (time)
  const uniqueXValues = [...new Set(data.map((item) => item[xField]))];
  const uniqueYValues = [...new Set(data.map((item) => item[yField]))];

  // Function to find value in data or return 0
  const getValue = (x, y) => {
    const item = data.find((d) => d[xField] === x && d[yField] === y);
    return item ? item[colorField] : 0;
  };

  // Get min and max values for color scale
  const values = data.map((item) => item[colorField]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  // Get color based on value
  const getColor = (value: number): string => {
    if (value === 0) return "#f3f4f6";
    const ratio: number = (value - minValue) / (maxValue - minValue || 1);

    if (ratio <= 0.33) {
      return colorRange[0];
    } else if (ratio <= 0.66) {
      return colorRange[1];
    } else {
      return colorRange[2];
    }
  };

  return (
    <div className="w-full">
      {title && (
        <h4 className="text-sm font-medium text-foreground mb-2">{title}</h4>
      )}
      <div className="overflow-auto" style={{ height: height }}>
        <div className="flex">
          <div className="w-32 min-w-[128px]"></div>
          <div className="flex space-x-1">
            {uniqueXValues.map((x) => (
              <div
                key={x}
                className="text-xs text-center w-10 min-w-[40px] rotate-[30deg] origin-bottom-left mt-10"
              >
                {x}
              </div>
            ))}
          </div>
        </div>

        {uniqueYValues.map((y) => (
          <div key={y} className="flex items-center h-10 mb-1">
            <div className="w-32 min-w-[128px] pr-2 text-sm font-medium text-right truncate">
              {y}
            </div>
            <div className="flex space-x-1">
              {uniqueXValues.map((x) => {
                const value = getValue(x, y);
                return (
                  <div
                    key={`${x}-${y}`}
                    className="w-10 h-10 min-w-[40px] flex items-center justify-center text-xs relative"
                    style={{ backgroundColor: getColor(value) }}
                    title={`${y} at ${x}: ${value}`}
                  >
                    <span
                      className={
                        value > maxValue * 0.6
                          ? "text-foreground"
                          : "text-gray-800"
                      }
                    >
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="flex items-center justify-end mt-4">
          <div className="text-xs mr-2">Low</div>
          <div className="flex h-4">
            {colorRange.map((color, i) => (
              <div
                key={i}
                className="w-8"
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
          <div className="text-xs ml-2">High</div>
        </div>
      </div>
    </div>
  );
};
