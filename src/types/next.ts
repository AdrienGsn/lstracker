/* eslint-disable @typescript-eslint/no-empty-object-type */

export type LayoutParams<T extends Record<string, string | string[]> = {}> = {
	params: Promise<T>;
	// searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
	children: React.ReactNode;
};

export type PageParams<T extends Record<string, string | string[]> = {}> = {
	params: Promise<T>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export type ErrorParams = {
	error: Error & { digest?: string };
	reset: () => void;
};
