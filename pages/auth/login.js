import { getCsrfToken } from "next-auth/react";

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default function Login({ csrfToken }) {
  console.info(csrfToken);
  return (
    <div>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="w-fit m-auto hover:opacity-80 duration-500">
            <a href="https://github.com/AntonSk98/Gnomepy">
              <img
                  className="mx-auto h-36 w-auto"
                  src="/logo.png"
                  alt="peppermint.sh logo"
              />
            </a>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-emerald-800 cursor-default">Sign in to your account</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10">
            <form
              className="space-y-6"
              method="post"
              action="/api/auth/callback/credentials"
            >
              <div>
                <input
                  name="csrfToken"
                  type="hidden"
                  defaultValue={csrfToken}
                />
                <label
                  htmlFor="email"
                  className="block text-base font-medium text-gray-800"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="shadow-sm block w-full sm:text-sm border-green-600 rounded-xl border-2 duration-300 focus:ring-emerald-800 focus:border-emerald-800 focus:ring-2"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-base font-medium text-gray-800"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="password"
                    required
                    className="shadow-sm block w-full sm:text-sm border-green-600 rounded-xl border-2 duration-300 focus:ring-emerald-800 focus:border-emerald-800 focus:ring-2"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group flex items-center px-4 py-2 text-sm font-medium bg-emerald-800 text-white rounded-xl hover:bg-gray-800 hover:text-white outline-none duration-500"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
