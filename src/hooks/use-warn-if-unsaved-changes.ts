import { useEffect } from "react";

export const useWarnIfUnsavedChanges = (unsaved: boolean, message?: string) => {
	useEffect(() => {
		const handleAnchorClick = (event: any) => {
			const targetUrl = event.currentTarget.href;

			const currentUrl = window.location.href;

			if (targetUrl !== currentUrl) {
				if (window.onbeforeunload) {
					// @ts-ignore
					const response = window.onbeforeunload();

					if (!response) {
						event.preventDefault();
					}
				}
			}
		};

		const handleMutation = () => {
			const anchorElements = document.querySelectorAll("a[href]");

			anchorElements.forEach((anchor) =>
				anchor.addEventListener("click", handleAnchorClick)
			);
		};

		const mutationObserver = new MutationObserver(handleMutation);

		mutationObserver.observe(document, { childList: true, subtree: true });

		return () => {
			mutationObserver.disconnect();

			const anchorElements = document.querySelectorAll("a[href]");

			anchorElements.forEach((anchor) =>
				anchor.removeEventListener("click", handleAnchorClick)
			);
		};
	}, []);

	// @ts-ignore
	useEffect(() => {
		const beforeUnloadHandler = () => {
			const yes = confirm(
				message ??
					"Changes you made has not been saved just yet. Do you wish to proceed anyway?"
			);

			return yes;
		};

		window.onbeforeunload = unsaved ? beforeUnloadHandler : null;

		return () => (window.onbeforeunload = null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [unsaved]);
};
