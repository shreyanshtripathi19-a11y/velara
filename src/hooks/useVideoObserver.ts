"use client";
import { useEffect } from "react";

export function useVideoObserver() {
	useEffect(() => {
		const obs = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) {
						setTimeout(() => {
							const v = e.target as HTMLVideoElement;
							v.currentTime = parseFloat(v.dataset.start || "0");
							v.play().catch(() => {});
						}, 1000);
						obs.unobserve(e.target);
					}
				});
			},
			{ threshold: 1 },
		);
		document.querySelectorAll(".hm-scroll-video").forEach((v) => {
			obs.observe(v);
			const st = parseFloat((v as HTMLVideoElement).dataset.start || "0");
			if (st > 0) (v as HTMLVideoElement).currentTime = st;
		});
		return () => obs.disconnect();
	}, []);
}
