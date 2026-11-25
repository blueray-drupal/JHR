import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const SCRIPT_ID = "jhr-recaptcha";

function loadRecaptcha(hl) {
    return new Promise((resolve, reject) => {
        const ready = () => {
            if (!window.grecaptcha) {
                reject(new Error("recaptcha-missing"));
                return;
            }
            window.grecaptcha.ready(() => resolve(window.grecaptcha));
        };

        if (window.grecaptcha?.render) {
            ready();
            return;
        }

        const existing = document.getElementById(SCRIPT_ID);
        if (existing) {
            existing.addEventListener("load", ready, { once: true });
            existing.addEventListener("error", () => reject(new Error("recaptcha-script")), { once: true });
            return;
        }

        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = `https://www.google.com/recaptcha/api.js?hl=${encodeURIComponent(hl)}&render=explicit`;
        script.async = true;
        script.defer = true;
        script.onload = ready;
        script.onerror = () => reject(new Error("recaptcha-script"));
        document.head.appendChild(script);
    });
}

const RecaptchaWidget = forwardRef(function RecaptchaWidget({ hl = "ar", onChange }, ref) {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);
    const onChangeRef = useRef(onChange);
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useImperativeHandle(ref, () => ({
        reset() {
            if (window.grecaptcha && widgetIdRef.current != null) {
                window.grecaptcha.reset(widgetIdRef.current);
            }
            onChangeRef.current?.("");
        },
    }));

    useEffect(() => {
        if (!siteKey || !containerRef.current) return undefined;
        let cancelled = false;

        loadRecaptcha(hl)
            .then((grecaptcha) => {
                if (cancelled || !containerRef.current || widgetIdRef.current != null) return;
                widgetIdRef.current = grecaptcha.render(containerRef.current, {
                    sitekey: siteKey,
                    callback: (token) => onChangeRef.current?.(token),
                    "expired-callback": () => onChangeRef.current?.(""),
                    "error-callback": () => onChangeRef.current?.(""),
                });
            })
            .catch(() => {
                onChangeRef.current?.("");
            });

        return () => {
            cancelled = true;
        };
    }, [hl, siteKey]);

    if (!siteKey) return null;

    return <div className="foi-recaptcha" ref={containerRef} />;
});

export default RecaptchaWidget;
