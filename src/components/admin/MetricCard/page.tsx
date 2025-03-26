// Define the MetricCardProps interface
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  isNegative?: boolean;
  icon?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isNegative = false,
  icon = null,
}) => (
  <div className="bg-background p-4 rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-background text-sm">{title}</h4>
      {icon && <span className="text-xl">{icon}</span>}
    </div>
    <div className="mt-2 flex items-baseline">
      <span className="text-2xl font-bold">{value}</span>
      {change && (
        <span
          className={`ml-2 text-sm ${isNegative ? "text-error" : "text-success"} flex items-center`}
        >
          {(() => {
            let prefix = "";
            if (!change.startsWith("+") && !change.startsWith("-")) {
              prefix = isNegative ? "-" : "+";
            }
            return prefix;
          })()}
          {change}
          {isNegative ? "↑" : "↓"}
        </span>
      )}
    </div>
  </div>
);

export default MetricCard;
