const AuthCard = ({ children, className = "" }) => {
  return (
    <div
      className={`w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8 ${className}`}
    >
      {children}
    </div>
  );
};

export default AuthCard;
