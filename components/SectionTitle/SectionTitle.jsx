import React from 'react';

const SectionTitle = ({ 
    subHeading, 
    heading, 
    variant = 'default',
    alignment = 'center',
    size = 'normal',
    showLine = true,
    className = '',
    description 
}) => {
    const variants = {
        default: {
            container: 'my-8',
            subHeading: 'text-[#FF6B00] mb-2 uppercase text-base md:text-lg italic font-semibold',
            heading: 'text-3xl md:text-4xl font-extrabold uppercase text-gray-900 leading-tight',
            line: 'w-[40%] lg:w-[28%] h-0.5 mx-auto bg-[#FF6B00] mb-4'
        },
        dashboard: {
            container: 'my-6',
            subHeading: 'text-[#FF6B00] mb-1 uppercase text-sm md:text-base font-medium tracking-wide',
            heading: 'text-2xl md:text-3xl font-bold text-gray-900 leading-tight',
            line: 'w-28 h-0.5 bg-[#FF6B00] mb-3'
        },
        minimal: {
            container: 'my-4',
            subHeading: 'text-[#FF6B00] mb-1 text-base font-medium uppercase tracking-wider',
            heading: 'text-xl md:text-3xl font-bold text-gray-900',
            line: 'w-20 h-0.5 bg-[#FF6B00] mb-2'
        },
        hero: {
            container: 'my-12',
            subHeading: 'text-[#FF6B00] mb-3 uppercase text-lg md:text-xl italic font-semibold tracking-wide',
            heading: 'text-4xl md:text-6xl font-extrabold uppercase text-gray-900 leading-tight',
            line: 'w-24 h-1 mx-auto bg-gradient-to-r from-[#FF6B00] to-[#FF8533] mb-6'
        }
    };

    const alignmentClasses = {
        center: 'text-center mx-auto',
        left: 'text-left',
        right: 'text-right ml-auto'
    };

    const currentVariant = variants[variant] || variants.default;
    const currentAlignment = alignmentClasses[alignment];

    return (
        <div className={`${currentVariant.container} ${currentAlignment} ${className}`}>
            {subHeading && (
                <p className={currentVariant.subHeading}>
                    {subHeading}
                </p>
            )}

            {showLine && (
                <div className={`${currentVariant.line} ${alignment === 'left' ? 'mx-0' : alignment === 'right' ? 'ml-auto mr-0' : 'mx-auto'}`} />
            )}

            <h2 className={currentVariant.heading}>
                {heading}
            </h2>

            {description && (
                <p className="text-gray-600 mt-1 text-base max-w-2xl mx-auto">
                    {description}
                </p>
            )}
        </div>
    );
};

//----------------------OLD ONE----------------------
// import React from 'react';

// const SectionTitle = ({ subHeading, heading }) => {
//     return (
//         <div className="text-center mx-auto my-8">
//             {/* The Subheading in the brand's primary color */}
//             <p className="text-[#FF6B00] mb-2 uppercase text-base md:text-lg italic font-semibold">{subHeading}</p>

//             {/* The Accent Line */}
//             <div className="w-1/3 h-0.5 mx-auto bg-[#FF6B00] mb-4"></div>

//             {/* The Main Heading in a dark color */}
//             <h3 className="text-3xl md:text-4xl font-extrabold uppercase text-gray-900 leading-tight">
//                 {heading}
//             </h3>
//         </div>
//     );
// };

export default SectionTitle;