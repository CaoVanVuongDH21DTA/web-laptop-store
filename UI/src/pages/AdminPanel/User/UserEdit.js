import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput
} from 'react-admin';

const EditUser = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput label="First Name" source="firstName" />
        <TextInput label="Last Name" source="lastName" />
        <TextInput label="Email" source="email" />
        <TextInput label="Phone Number" source="phoneNumber" />
        <TextInput label="Avatar URL" source="avatarUrl" />
        <BooleanInput
          source="enabled"
          label="Kích hoạt"
          format={(v) => v === 'true' || v === true || v === 1}
        />

      </SimpleForm>
    </Edit>
  );
};

export default EditUser;