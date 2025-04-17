import { Button } from '@/components/ui/button';
import notFound from '../../assets/images/not-found.jpg';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  // handle click
  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-svh text-center space-y-4 bg-cover bg-center bg-no-repeat text-black"
      style={{ backgroundImage: `url(${notFound})` }}
    >
      <h1 className="text-[120px] font-extrabold leading-none drop-shadow-lg">404 - Error</h1>
      <p className="text-[50px]">PAGE NOT FOUND</p>
      <p className="text-[20px]">Your search has ventured beyond the known universe!</p>
      <Button className="bg-blue-800 hover:bg-blue-950 cursor-pointer text-xl py-5 px-5" onClick={handleGoBack}>
        Go back
      </Button>
    </div>
  );
}

export default NotFoundPage;
