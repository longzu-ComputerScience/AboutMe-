interface SkillBadgeProps {
    name: string;
    icon?: string;
    level?: "beginner" | "intermediate" | "advanced" | "expert";
    category?: string;
}

export default function SkillBadge({ name, icon, level, category }: SkillBadgeProps) {
    const getLevelColor = () => {
        switch (level) {
            case "expert":
                return "from-amber-400 to-orange-500";
            case "advanced":
                return "from-emerald-400 to-teal-500";
            case "intermediate":
                return "from-primary-400 to-cyan-500";
            case "beginner":
                return "from-gray-400 to-gray-500";
            default:
                return "from-primary-400 to-accent-purple";
        }
    };

    const getLevelWidth = () => {
        switch (level) {
            case "expert":
                return "w-full";
            case "advanced":
                return "w-3/4";
            case "intermediate":
                return "w-1/2";
            case "beginner":
                return "w-1/4";
            default:
                return "w-full";
        }
    };

    return (
        <div className="group relative bg-dark-card border border-dark-border rounded-xl p-4 hover:border-primary-500/30 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
                {icon && <span className="text-2xl">{icon}</span>}
                <div>
                    <h4 className="font-medium text-white group-hover:text-primary-400 transition-colors">
                        {name}
                    </h4>
                    {category && (
                        <span className="text-xs text-dark-muted">{category}</span>
                    )}
                </div>
            </div>

            {level && (
                <div className="space-y-1">
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${getLevelColor()} ${getLevelWidth()} rounded-full transition-all duration-500`}
                        />
                    </div>
                    <span className="text-xs text-dark-muted capitalize">{level}</span>
                </div>
            )}
        </div>
    );
}
