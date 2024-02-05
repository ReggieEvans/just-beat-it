import { Bars } from 'react-loader-spinner';

export default function Spinner({ message, size }) {
  return (
    <>
      <div className='flex flex-col items-center mt-8 mb-8'>
        <Bars
          height={size}
          width={size}
          color='#2563eb'
          ariaLabel='bars-loading'
          visible={true}
        />
        <div className='mt-8 text-md'>{message}</div>
      </div>
    </>
  );
}
