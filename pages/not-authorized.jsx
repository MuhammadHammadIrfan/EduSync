import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiShield, FiArrowLeft } from 'react-icons/fi';

export default function NotAuthorized() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Not Authorized | EduSync</title>
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
            <FiShield className="h-10 w-10 text-red-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Access Denied
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          You do not have permission to access this page.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-700">
                This page is restricted to authorized personnel only. If you believe you should have access, please contact your administrator.
              </p>
            </div>
            <div className="flex justify-center">
              <Link href="/login" legacyBehavior>
                <a className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <FiArrowLeft className="mr-2" />
                  Return to Login
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
