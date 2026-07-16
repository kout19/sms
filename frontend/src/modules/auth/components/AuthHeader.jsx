const AuthHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
};

export default AuthHeader;
