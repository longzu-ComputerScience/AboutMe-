import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ServiceCardProps {
    title: string;
    description: string;
    price: string;
    priceNote?: string;
    features: string[];
    highlighted?: boolean;
    ctaText?: string;
    ctaLink?: string;
}

export default function ServiceCard({
    title,
    description,
    price,
    priceNote,
    features,
    highlighted = false,
    ctaText = "Get Started",
    ctaLink = "/contact",
}: ServiceCardProps) {
    return (
        <div
            className={`relative rounded-2xl p-6 md:p-8 transition-all duration-300 ${highlighted
                    ? "bg-gradient-to-br from-primary-500/10 via-accent-purple/10 to-pink-500/10 border-2 border-primary-500/50 shadow-glow-md"
                    : "bg-dark-card border border-dark-border hover:border-primary-500/30"
                }`}
        >
            {/* Popular Badge */}
            {highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 text-sm font-medium rounded-full bg-gradient-to-r from-primary-500 to-accent-purple text-white shadow-glow-sm">
                        Most Popular
                    </span>
                </div>
            )}

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-sm text-dark-muted">{description}</p>
                </div>

                {/* Price */}
                <div className="py-4 border-y border-dark-border">
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl md:text-4xl font-bold gradient-text">
                            {price}
                        </span>
                        {priceNote && (
                            <span className="text-sm text-dark-muted">{priceNote}</span>
                        )}
                    </div>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-emerald-400" />
                            </div>
                            <span className="text-sm text-dark-text/80">{feature}</span>
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <Link
                    href={ctaLink}
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium transition-all duration-300 ${highlighted
                            ? "btn-glow"
                            : "bg-white/10 hover:bg-white/20 text-white"
                        }`}
                >
                    {ctaText}
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
