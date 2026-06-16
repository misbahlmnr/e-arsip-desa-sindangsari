import { useState } from "react";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import FlashMessage from "@/components/FlashMessage";

export default function AppLayout({ title, subtitle, children }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex h-dvh w-full bg-background overflow-hidden">
            <FlashMessage />
            <AppSidebar collapsed={collapsed} />
            <div className="flex-1 flex flex-col min-w-0 min-h-0">
                <AppHeader
                    title={title}
                    subtitle={subtitle}
                    onToggleSidebar={() => setCollapsed((c) => !c)}
                />
                <main className="flex-1 overflow-y-auto min-h-0">
                    <div className="p-6 md:p-10 max-w-[1400px] mx-auto w-full animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
