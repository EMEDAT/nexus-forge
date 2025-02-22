import { usResources } from '@/config/countries/us/resources';

export default function USResources() {
  const resourceTypeColors = {
    'guide': 'blue',
    'course': 'indigo',
    'webinar': 'purple',
    'tool': 'teal',
    'template': 'cyan'
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-blue-800">US Architectural Resources</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usResources.map((resource) => (
          <div key={resource.id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-100">
            <div className={`mb-4 bg-${resourceTypeColors[resource.type]}-100 text-${resourceTypeColors[resource.type]}-800 inline-block px-3 py-1 rounded-full text-sm`}>
              {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
            </div>
            
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">{resource.title}</h2>
            <p className="text-gray-600 mb-4">{resource.description}</p>
            
            <div className="mb-4">
              <h3 className="font-bold">Languages:</h3>
              <div className="flex flex-wrap gap-2">
                {resource.language.map((lang, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-bold">Availability:</h3>
              <span className={`
                inline-block px-3 py-1 rounded-full text-sm
                ${resource.isFree ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
              `}>
                {resource.isFree ? 'Free' : 'Paid'}
              </span>
            </div>

            {resource.url && (
              <div>
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Access Resource
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}