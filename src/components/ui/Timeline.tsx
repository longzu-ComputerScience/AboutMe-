interface TimelineItem {
    year: string;
    title: string;
    description: string;
    organization?: string;
    type: "education" | "work" | "achievement";
}

interface TimelineProps {
    items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
    const getTypeColor = (type: TimelineItem["type"]) => {
        switch (type) {
            case "education":
                return "from-primary-500 to-cyan-500";
            case "work":
                return "from-accent-purple to-pink-500";
            case "achievement":
                return "from-emerald-500 to-teal-500";
            default:
                return "from-primary-500 to-accent-purple";
        }
    };

    const getTypeIcon = (type: TimelineItem["type"]) => {
        switch (type) {
            case "education":
                return "🎓";
            case "work":
                return "💼";
            case "achievement":
                return "🏆";
            default:
                return "📌";
        }
    };

    return (
        <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-accent-purple to-pink-500 opacity-30" />

            <div className="space-y-8">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="relative pl-16 group"
                    >
                        {/* Timeline dot */}
                        <div
                            className={`absolute left-4 w-5 h-5 rounded-full bg-gradient-to-r ${getTypeColor(
                                item.type
                            )} flex items-center justify-center shadow-glow-sm group-hover:scale-125 transition-transform duration-300`}
                        >
                            <div className="w-2 h-2 rounded-full bg-white" />
                        </div>

                        {/* Content */}
                        <div className="bg-dark-card border border-dark-border rounded-xl p-5 group-hover:border-primary-500/30 transition-colors duration-300">
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <div>
                                    <span className="text-2xl mr-2">{getTypeIcon(item.type)}</span>
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/10 text-dark-muted">
                                        {item.year}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-white mb-1">
                                {item.title}
                            </h3>

                            {item.organization && (
                                <p className="text-sm text-primary-400 mb-2">
                                    {item.organization}
                                </p>
                            )}

                            <p className="text-sm text-dark-muted">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
