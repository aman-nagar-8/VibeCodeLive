import { motion } from 'framer-motion';
import { Search, Calendar, Users } from 'lucide-react';

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100"
    >
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center"
            >
              <Search className="w-10 h-10 text-blue-600" />
            </motion.div>
          </div>
        </div>

        <h3 className="text-gray-900 mb-2">Find Your Meeting</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Start typing in the search bar above to find and join your meeting instantly
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-gray-700">Join live meetings</p>
            <p className="text-gray-500">Connect in real-time</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-gray-700">View scheduled</p>
            <p className="text-gray-500">See upcoming events</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}