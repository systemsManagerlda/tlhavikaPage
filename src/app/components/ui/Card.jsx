import { forwardRef } from 'react';
import clsx from 'clsx';

const Card = forwardRef(({
  children,
  className,
  as: Component = 'div',
  hoverEffect = true,
  variant = 'default',
  ...props
}, ref) => {
  const baseClasses = 'rounded-lg border border-gray-200 overflow-hidden shadow-sm transition-all duration-300 dark:border-gray-700';
  
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800',
    primary: 'bg-green-50 border-green-100 dark:bg-green-900/30 dark:border-green-800/50',
    secondary: 'bg-blue-50 border-blue-100 dark:bg-blue-900/30 dark:border-blue-800/50',
    dark: 'bg-gray-800 border-gray-700 text-white',
  };

  const hoverClasses = hoverEffect ? 'hover:shadow-md hover:-translate-y-1' : '';

  return (
    <Component
      ref={ref}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = 'Card';

const CardHeader = ({ children, className, ...props }) => (
  <div
    className={clsx(
      'px-4 py-3 border-b border-gray-200 dark:border-gray-700',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const CardTitle = ({ children, className, ...props }) => (
  <h3
    className={clsx(
      'text-lg font-semibold text-gray-900 dark:text-white',
      className
    )}
    {...props}
  >
    {children}
  </h3>
);

const CardDescription = ({ children, className, ...props }) => (
  <p
    className={clsx(
      'text-sm text-gray-500 dark:text-gray-400',
      className
    )}
    {...props}
  >
    {children}
  </p>
);

const CardContent = ({ children, className, ...props }) => (
  <div
    className={clsx(
      'p-4',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const CardFooter = ({ children, className, ...props }) => (
  <div
    className={clsx(
      'px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/20',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
};