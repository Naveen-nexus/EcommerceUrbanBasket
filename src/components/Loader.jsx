/**
 * Loader — Full-page or inline loading spinner.
 */
export default function Loader({ fullPage = true, size = 'md', text = 'Loading...' }) {
    const sizeClasses = {
        sm: 'h-6 w-6 border-2',
        md: 'h-10 w-10 border-3',
        lg: 'h-14 w-14 border-4',
    };

    const spinner = (
        <div className="flex flex-col items-center gap-3">
            <div
                className={`${sizeClasses[size]} animate-spin rounded-full border-primary-200 border-t-primary-600`}
            />
            {text && <p className="text-sm text-gray-500 font-medium animate-pulse">{text}</p>}
        </div>
    );

    if (fullPage) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                {spinner}
            </div>
        );
    }

    return spinner;
}
