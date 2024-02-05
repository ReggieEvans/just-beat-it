import { RotatingLines } from 'react-loader-spinner';

export default function BtnSpinner({ size }) {
  return (
    <>
      <div className="flex flex-col items-center py-1">
        <RotatingLines
          visible={true}
          height={size}
          width={size}
          strokeColor="white"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    </>
  );
}
