import { memo, useState } from "react";
import ExpandBtn from "./ExpandBtn";
import Content from "./Content";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";

const DashBoard = () => {
  const { setIsDashboardOpen, isDashboardOpen } = useWorkspaceStore(
    (state) => state,
  );
  return (
    <div
      className={`fixed left-0 top-[50%] h-[calc(100vh-64px)] w-96 translate-y-[-50%] rounded-r-lg bg-gray-50/70 shadow-xl ${isDashboardOpen ? "translate-x-0" : "translate-x-[-97%]"} p-4 transition-all`}
    >
      <Content />
      <ExpandBtn
        isExpanded={isDashboardOpen}
        toggleDashboard={() => setIsDashboardOpen(!isDashboardOpen)}
      />
    </div>
  );
};

export default DashBoard;