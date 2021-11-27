import Head from 'next/head';
import { useFieldArray, useForm } from 'react-hook-form';
import type { NextPage } from 'next';
import { useState } from 'react';

export const formatNumber = (value: number): string => {
    if (!Number(value)) return value === 0 ? '0' : '';

    const WHOLE_NUMBER_REGEX = /^\d+(?=\.)?/;

    const number = value.toString();
    const wholeNumber = number.match(WHOLE_NUMBER_REGEX)[0];
    const dividedNumber = wholeNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return number.replace(WHOLE_NUMBER_REGEX, dividedNumber);
};

const CONSTS = {
    FIELDS: 'fields',
    FIELD: 'field',
};

// interface FormModel

const Home: NextPage = () => {
    const [result, setResult] = useState('');
    const { register, handleSubmit, reset, control, formState } = useForm();
    const { isSubmitted } = formState;
    const { fields, append, remove } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: 'fields',
        shouldUnregister: true,
    });

    const onSubmit = (data: any) => {
        const total = data?.[CONSTS.FIELD]?.reduce(
            (accumulator, current) => accumulator + current?.value,
            0
        );
        setResult(formatNumber(total));
    };

    const handleReset = () => {
        reset();
        setResult('');
    };

    const handleRemoveField = (index: number) => () => remove(index);

    return (
        <div className='wrapper'>
            <Head>
                <title>Fee Calculator</title>
                <meta name='description' content='Fee Calculator' />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <>
                <form>
                    <div className='fee'>
                        <div className='fieldsName'>
                            {fields.map((field, index) => (
                                <div className='fieldName' key={index}>
                                    <input
                                        key={field.id}
                                        {...register(
                                            `field.${index}.name` as const,
                                            {
                                                required: true,
                                            }
                                        )}
                                        placeholder='Enter field name'
                                        readOnly={isSubmitted}
                                    />
                                </div>
                            ))}

                            {Number(result) !== 0 && (
                                <div className='total'>Total</div>
                            )}
                        </div>

                        <div className='fieldsValue'>
                            {fields.map((field, index) => (
                                <div className='fieldValue' key={index}>
                                    <input
                                        key={field.id} // important to include key with field's id
                                        {...register(
                                            `field.${index}.value` as const,
                                            {
                                                required: true,
                                                valueAsNumber: true,
                                            }
                                        )}
                                        type='number'
                                    />

                                    <span onClick={handleRemoveField(index)}>
                                        X
                                    </span>
                                </div>
                            ))}

                            {Number(result) !== 0 && (
                                <div className='result'>{result}</div>
                            )}
                        </div>
                    </div>
                </form>

                <div className='actions'>
                    <button type='button' onClick={append}>
                        Add field
                    </button>
                    <button onClick={handleSubmit(onSubmit)}>Calculate</button>
                    <button onClick={handleReset}>Reset</button>
                </div>
            </>

            <style jsx>
                {`
                    .wrapper {
                        height: 100vh;
                    }

                    .fee {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .fieldName {
                        margin-bottom: 8px;
                        margin-right: 8px;
                    }

                    .fieldValue {
                        margin-bottom: 8px;
                    }

                    .fieldValue span {
                        display: inline-block;
                        margin-left: 8px;
                    }

                    .total {
                        display: flex;
                        justify-content: center;
                    }

                    .actions {
                        margin: 10px 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .actions * + * {
                        margin-left: 8px;
                    }

                    .result {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                `}
            </style>
        </div>
    );
};

export default Home;
