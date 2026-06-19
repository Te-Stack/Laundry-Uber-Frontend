// Shared error display component used in auth forms and dashboard request forms.
export function ErrorBanner({ message }: { message: string }) {
    return (
        <div className="rounded-md border border-red-200 bg-red-50 dark:bg-red-950/50 dark:border-red-800 px-3 py-2 text-sm text-red-700 dark:text-red-400">
            {message}
        </div>
    )
}
