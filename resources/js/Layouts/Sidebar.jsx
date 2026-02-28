import { Link } from "@inertiajs/react";
import { BookOpen, ChevronRight } from "lucide-react";

const Sidebar = ({ menuItems }) => (
    <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-gray-900">
                        E-Arsip
                    </span>
                    <span className="text-xs text-gray-500">
                        Kantor Desa Sindangsari
                    </span>
                </div>
            </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
                <div key={item.name}>
                    {item.children ? (
                        <div>
                            <button
                                onClick={() =>
                                    setExpandedMenus((prev) => ({
                                        ...prev,
                                        [item.name]: !prev[item.name],
                                    }))
                                }
                                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    expandedMenus[item.name]
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                <span className="flex-1 text-left">
                                    {item.name}
                                </span>
                                <motion.div
                                    animate={{
                                        rotate: expandedMenus[item.name]
                                            ? 90
                                            : 0,
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {expandedMenus[item.name] && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{
                                            opacity: 1,
                                            height: "auto",
                                        }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="ml-8 mt-2 space-y-1 overflow-hidden"
                                    >
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.name}
                                                href={child.href}
                                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                    child.current
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                }`}
                                            >
                                                <child.icon className="w-4 h-4 mr-3" />
                                                <span>{child.name}</span>
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link
                            href={item.href}
                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                item.current
                                    ? "bg-blue-100 text-blue-700"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            <span>{item.name}</span>
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    </div>
);

export default Sidebar;
