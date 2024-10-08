import type { NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export const formatNumber = (value: number): string => {
  if (!Number(value)) return value === 0 ? "0" : "";

  const WHOLE_NUMBER_REGEX = /^\d+(?=\.)?/;

  const number = value.toString();
  const wholeNumber = number.match(WHOLE_NUMBER_REGEX)[0];
  const dividedNumber = wholeNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return number.replace(WHOLE_NUMBER_REGEX, dividedNumber);
};

export const convertTimeNumberToString = (raw: number): string => {
  if (raw < 10) return `T${raw.toString()}`;
  return `T${raw.toString()}`;
};

const CONSTS = {
  FIELDS: "fields",
  FIELD: "field",
};

const templateKLData = [
  { name: "Tiền ĐT Mẹ 261", value: null },
  { name: "Tiền ĐT Mẹ 135", value: null },
  { name: "Tiền ĐT Bố", value: null },
  { name: "Tiền Internet KL", value: null },
  { name: "Tiền điện KL 1", value: null },
  { name: "Tiền điện KL 2", value: null },
  { name: "Tiền điện KL 3", value: null },
  { name: "Tiền nước KL 1", value: null },
  { name: "Tiền nước KL 2", value: null },
];

const templateRoyalData = [
  { name: "Tiền ĐT Còi", value: null },
  { name: "Tiền Điện Royal", value: null },
  { name: "Tiền Nhà Royal", value: null },
];

const templateData = {
  KL: templateKLData,
  Royal: templateRoyalData,
};

const currentMonth = convertTimeNumberToString(new Date().getMonth() + 1);
const currentYear = new Date().getFullYear();

// interface FormModel

const Home: NextPage = () => {
  const [result, setResult] = useState("");
  const { register, handleSubmit, reset, watch, setValue, control, formState } =
    useForm();
  const { isSubmitted } = formState;
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "fields",
    shouldUnregister: true,
  });

  const onSubmit = (data) => {
    const total = data?.[CONSTS.FIELDS]?.reduce(
      (accumulator, current) => accumulator + current?.value,
      0
    );
    setResult(formatNumber(total));
  };

  const onError = (errors) => console.error(errors);

  const handleReset = () => {
    reset();
    setResult("");
  };

  const handleAdd = () => {
    if (isSubmitted) reset(undefined, { keepValues: true }); // values in reset is optional so we put undefined as TS docs, https://stackoverflow.com/questions/30734509/how-to-pass-optional-parameters-while-omitting-some-other-optional-parameters
    append({});
  };

  const handleRemoveField = (index: number) => () => remove(index);

  // TEMPLATE PART
  const templateSelectValue = watch("template") || "";

  const handleChangeTemplate = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!event.target.value) return handleReset();
    remove();
    templateData[event.target.value].forEach((item) => append(item));
    setValue("template", event.target.value);
  };

  return (
    <div className="wrapper">
      <Head>
        <title>Fee Calculator</title>
        <meta name="description" content="Fee Calculator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <form>
        <div className="fee">
          <div className="fieldsName">
            {fields.map((field, index) => (
              <div className="fieldName" key={index}>
                <input
                  key={field.id}
                  {...register(`fields.${index}.name` as const, {
                    required: true,
                  })}
                  placeholder="Enter field name"
                  readOnly={isSubmitted}
                />
              </div>
            ))}

            {Number(result) !== 0 && (
              <>
                <div className="total">Total</div>
                <div className="total">Date</div>
              </>
            )}
          </div>

          <div className="fieldsValue">
            {fields.map((field, index) => (
              <div className="fieldValue" key={index}>
                <input
                  key={field.id} // important to include key with field's id
                  {...register(`fields.${index}.value` as const, {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                />

                <span onClick={handleRemoveField(index)}>X</span>
              </div>
            ))}

            {Number(result) !== 0 && (
              <>
                <div className="result">{result}</div>
                <div className="result">{`${currentMonth}/${currentYear}`}</div>
              </>
            )}
          </div>
        </div>
      </form>

      <div className="actions">
        <label htmlFor="Template">Select a template:</label>
        <select
          {...register("template")}
          value={templateSelectValue}
          onChange={handleChangeTemplate}
          name="template"
          id="template"
        >
          <option value="">Choose here</option>
          <option value="KL">KL Template</option>
          <option value="Royal">Royal Template</option>
        </select>

        <button type="button" onClick={handleAdd}>
          Add field
        </button>
        <button type="button" onClick={handleSubmit(onSubmit, onError)}>
          Calculate
        </button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
      </div>

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
            cursor: pointer;
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
