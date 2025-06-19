import React, { useState, useEffect } from 'react';
import {
  ArrayInput,
  SelectInput,
  SimpleFormIterator,
  useDataProvider,
  FormDataConsumer,
  required,
  useRecordContext,
} from 'react-admin';
import { useFormContext } from 'react-hook-form';

const SpecificationInput = () => {
  const [specs, setSpecs] = useState([]);
  const [converted, setConverted] = useState(false);
  const dataProvider = useDataProvider();
  const record = useRecordContext();
  const { setValue } = useFormContext();

  // 🔁 Load specification definitions
  useEffect(() => {
    dataProvider
      .getList('specifications', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'name', order: 'ASC' },
        filter: {},
      })
      .then(({ data }) => setSpecs(data))
      .catch(() => setSpecs([]));
  }, [dataProvider]);

  // ✅ Chuyển đổi chỉ 1 lần khi có cả record + specs
  useEffect(() => {
    if (
      record?.specifications &&
      specs.length > 0 &&
      !converted // tránh lặp vô hạn
    ) {
      const updatedSpecs = record.specifications.map((spec) => {
        const matchedSpec = specs.find((s) => s.name === spec.name);
        const matchedValue = matchedSpec?.specificationValues.find(
          (v) => v.value === spec.value
        );

        return matchedSpec && matchedValue
          ? {
              specificationId: matchedSpec.id,
              specificationValueId: matchedValue.id,
            }
          : {};
      });

      setValue('specifications', updatedSpecs);
      setConverted(true); // ✅ Không update nữa sau lần đầu
    }
  }, [record, specs, setValue, converted]);

  return (
    <ArrayInput source="specifications" label="Thông số kỹ thuật">
      <SimpleFormIterator>
        <SelectInput
          source="specificationId"
          label="Thông số"
          choices={specs}
          optionText="name"
          optionValue="id"
          validate={[required()]}
        />
        <FormDataConsumer>
          {({ scopedFormData, index }) => {
            const selectedSpec = specs.find(
              (s) => s.id === scopedFormData?.specificationId
            );
            const valueChoices = selectedSpec?.specificationValues || [];

            return (
              <SelectInput
                source={"specificationValueId"}
                label="Giá trị"
                choices={valueChoices}
                optionText="value"
                optionValue="id"
                validate={[required()]}
              />
            );
          }}
        </FormDataConsumer>
      </SimpleFormIterator>
    </ArrayInput>
  );
};

export default SpecificationInput;
