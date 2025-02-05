const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-full flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="w-sm">{children}</div>
  </div>
);

export default AuthLayout;
