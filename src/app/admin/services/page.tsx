"use client";

import { useState } from "react";
import { Edit, Trash2, Plus, GripVertical } from "lucide-react";
import { services } from "@/lib/mockData";

export default function AdminServicesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Services</h1>
                    <p className="text-dark-muted">Manage your service offerings</p>
                </div>
                <button className="btn-glow inline-flex items-center gap-2 justify-center">
                    <Plus className="w-4 h-4" />
                    Add Service
                </button>
            </div>

            {/* Services List */}
            <div className="space-y-4">
                {services.map((service, index) => (
                    <div
                        key={service.id}
                        className={`bg-dark-card border rounded-2xl p-6 ${service.highlighted
                                ? "border-primary-500/50"
                                : "border-dark-border"
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            {/* Drag Handle */}
                            <button className="p-2 rounded-lg hover:bg-white/10 cursor-grab">
                                <GripVertical className="w-5 h-5 text-dark-muted" />
                            </button>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-semibold">{service.title}</h3>
                                            {service.highlighted && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400">
                                                    Popular
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-dark-muted mb-3">
                                            {service.description}
                                        </p>
                                        <p className="text-xl font-bold gradient-text">
                                            {service.price}
                                            <span className="text-sm font-normal text-dark-muted ml-1">
                                                {service.priceNote}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mt-4 pt-4 border-t border-dark-border">
                                    <p className="text-xs text-dark-muted mb-2">Features:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {service.features.map((feature, i) => (
                                            <span
                                                key={i}
                                                className="text-xs px-2 py-1 rounded bg-white/5 text-dark-text/70"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
