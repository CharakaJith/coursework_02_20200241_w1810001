import map from '../../assets/animations/map.gif';
import SignUpForm from '@/components/sign-up/signup-form';

function HomePage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-gradient-to-r from-blue-950 via-blue-500 to-white">
      {/* left hand side */}
      <div className="hidden lg:flex items-center justify-center">
        <div className="h-full w-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <img src={map} alt="Animated map" className="max-w-[300px] max-h-[300px] object-contain mb-4" />
            <h1 className="text-white text-xl font-semibold text-center">A Global Journey Through Stories</h1>
          </div>
        </div>
      </div>

      {/* right hand side */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md text-center">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
