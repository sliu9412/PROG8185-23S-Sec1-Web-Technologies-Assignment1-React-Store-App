import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

function LayoutComp({ children }: LayoutProps) {
  return <div className="container p-3 pl-5">{children}</div>;
}

export default LayoutComp;
