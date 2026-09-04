const DepartmentCard = ({
  icon: Icon,
  value,
  title,
  descriptions,
  change = "",
  isPosetive,
  icongBgColor,
  iconColor,
  iconSize,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 mb-3 ">
      <div className="flex flex-col gap-3  ">
        <div className="flex items-center justify-between gap-3 ">
          <div
            className={`w-10 h-10 ${icongBgColor} rounded-xl flex items-center justify-center `}
          >
            <Icon size={iconSize} className={`${iconColor}`} />
          </div>
          <div>
            <span
              className={`text-sm  ${isPosetive ? "text-green-600" : "text-red-600"}`}
            >
              {change}
            </span>
          </div>
        </div>
        <div>
          <span className="text-lg font-bold ">{value}</span>
        </div>
        <div>
          <h1 className="text-slate-500 text-sm ">{title}</h1>
          <p className="text-slate-600 text-sm ">{descriptions}</p>
        </div>
      </div>
    </div>
  );
};

export default DepartmentCard;
