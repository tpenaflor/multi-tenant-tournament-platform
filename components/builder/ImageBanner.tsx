import React from 'react';

export interface ImageBannerProps {
  title?: string;
  overline?: string;
  imageUrl?: string;
}

export const ImageBanner: React.FC<ImageBannerProps> = ({
  title = "Where legends are made.",
  overline = "Global Championship Series",
  imageUrl = "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
}) => {
  return (
    <div className="group relative min-h-[480px] w-full overflow-hidden rounded-[2rem] bg-tenant-bg my-4">
      <img 
        src={imageUrl} 
        alt={title} 
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-tenant-bg via-tenant-bg/40 to-transparent"></div>
      <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12 text-white">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 drop-shadow-md">
          {overline}
        </p>
        <h3 className="mt-4 max-w-2xl font-black text-4xl sm:text-5xl leading-tight tracking-tight drop-shadow-lg">
          {title}
        </h3>
      </div>
    </div>
  );
};
