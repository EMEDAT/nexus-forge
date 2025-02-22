import Image from 'next/image';
import { usArchitecturalStyles } from '@/config/countries/us/styles';

export default function USArchitecturalStyles() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-blue-800">Architectural Styles of the United States</h1>
      
      {usArchitecturalStyles.map((style) => (
        <div key={style.id} className="mb-12 bg-white shadow-lg rounded-lg overflow-hidden">
          {style.imageUrl && (
            <div className="w-full h-64 md:h-96 relative">
              <Image 
                src={style.imageUrl} 
                alt={style.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-4 text-blue-700">{style.name}</h2>
            
            <p className="text-gray-600 mb-6">{style.description}</p>
            
            {style.periodStart && style.periodEnd && (
              <div className="mb-4">
                <h3 className="font-bold text-lg">Period:</h3>
                <p>{style.periodStart} - {style.periodEnd || 'Present'}</p>
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Key Features:</h3>
              <ul className="list-disc list-inside text-gray-700">
                {style.keyFeatures.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            
            {style.examples && style.examples.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-2">Notable Examples:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {style.examples.map((example, index) => (
                    <div key={index} className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800">{example.name}</h4>
                      <p className="text-gray-600">{example.location}</p>
                      {example.year && <p className="text-sm text-gray-500">Year: {example.year}</p>}
                      {example.description && <p className="mt-2 text-sm">{example.description}</p>}
                      {example.image && (
                        <div className="mt-4 w-full h-48 relative">
                          <Image 
                            src={example.image} 
                            alt={example.name}
                            fill
                            className="object-cover rounded-lg"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}