import BusAdminManager from '../../components/BusAdminManager';

export default function BusManagementPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-6 p-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl shadow-lg">
        <span className="text-3xl">🚌</span>
        <h1 className="text-2xl font-bold">Bus Management</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <BusAdminManager />
      </div>
    </div>
  );
} 