import { Button } from '@/modules/common/components/button';
import { useSample } from '@/modules/sample/hooks/use-sample';
import { useEffect, useRef } from 'react';

function SuccessAlert() {
  return (
    <div
      className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
      role="alert"
    >
      <svg
        className="shrink-0 inline w-4 h-4 me-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <span className="sr-only">Info</span>
      <div>
        <span className="font-medium">Nice!</span> Successfully Added Sample.
      </div>
    </div>
  );
}

export function SampleForm() {
  const { addSample, isSuccess, isPending } = useSample();
  const formRef = useRef();

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!formRef.current) {
      return;
    }

    const formData = new FormData(formRef.current);

    const { name } = Object.fromEntries(formData.entries());

    await addSample(name);
  };

  useEffect(() => {
    if (isSuccess) {
      formRef.current.reset();
    }
  }, [isSuccess]);

  return (
    <div>
      {isSuccess && <SuccessAlert />}
      <form ref={formRef} onSubmit={onSubmit}>
        <fieldset className="grid gap-2" disabled={isPending}>
          <div className="flex gap-2 items-center">
            <label className="text-sm">Name</label>
            <input type="text" required name="name" className="border px-2 py-1 rounded-sm" />
          </div>
          <div>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
