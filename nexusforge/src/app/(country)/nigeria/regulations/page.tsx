import { nigerianBuildingCodes } from '@/config/countries/nigeria/regulations';

export default function NigeriaRegulations() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-green-800">Nigerian Building Regulations</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nigerianBuildingCodes.map((code) => (
          <div key={code.id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4 text-green-700">{code.name}</h2>
            <p className="text-gray-600 mb-4">{code.description}</p>
            
            <div className="mb-4">
              <h3 className="font-bold">Enforcement Level:</h3>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {code.enforcementLevel.charAt(0).toUpperCase() + code.enforcementLevel.slice(1)}
              </span>
            </div>

            <div className="mb-4">
              <h3 className="font-bold">Last Updated:</h3>
              <p>{code.lastUpdated}</p>
            </div>

            {code.url && (
              <div>
                <a 
                  href={code.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Detailed Regulations
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}