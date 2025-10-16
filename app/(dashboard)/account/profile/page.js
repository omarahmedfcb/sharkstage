export default function ProfilePage() {
  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">

        {/* Left card */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 border border-gray-200 flex flex-col items-center min-h-[220px]">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 border border-gray-300 shadow">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/001/840/618/small_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm text-gray-600 mb-2">Profile Picture</p>
          <button className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition mb-2">Upload</button>
          <button className="w-full py-2 text-red-500 bg-gray-100 rounded-md hover:bg-gray-200 transition">Remove</button>
        </div>

        {/* Right form */}
        <div className="md:col-span-2 bg-white shadow rounded-lg p-4 sm:p-6 border border-gray-200">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" defaultValue="John Doe" className="mt-1 p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" defaultValue="john@example.com" className="mt-1 p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input type="password" placeholder="Leave empty to keep current password" className="mt-1 p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <button type="button" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-full sm:w-auto">Export</button>
              <button type="button" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 w-full sm:w-auto">Delete</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
