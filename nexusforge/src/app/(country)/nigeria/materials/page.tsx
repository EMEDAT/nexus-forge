import { nigerianMaterials } from '@/config/countries/nigeria/materials';

export default function NigeriaMaterials() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-green-800">Nigerian Construction Materials</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nigerianMaterials.map((material) => (
          <div key={material.id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4 text-green-700">{material.name}</h2>
            <p className="text-gray-600 mb-4">{material.description}</p>
            
            <div className="mb-4">
              <h3 className="font-bold">Cost Details:</h3>
              <p>
                {material.localCost.amount} {material.localCost.unit}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="font-bold">Availability:</h3>
              <span className={`
                inline-block px-3 py-1 rounded-full text-sm
                ${material.availability === 'high' ? 'bg-green-100 text-green-800' : 
                  material.availability === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'}
              `}>
                {material.availability.charAt(0).toUpperCase() + material.availability.slice(1)}
              </span>
            </div>

            <div>
              <h3 className="font-bold mb-2">Common Uses:</h3>
              <ul className="list-disc list-inside text-gray-700">
                {material.commonUses.map((use, index) => (
                  <li key={index}>{use}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}