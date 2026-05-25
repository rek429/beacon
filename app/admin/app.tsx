"use client";

import {
  Admin,
  Resource,
  List,
  SimpleList,
  Datagrid,
  TextField,
  NumberField,
  ReferenceField,
  SelectField,
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  BooleanInput,
  Create,
  required,
} from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

const dataProvider = simpleRestProvider("/api/admin");

// ── Tracks ───────────────────────────────────────────────────────────────────

const TrackList = () => (
  <List>
    <Datagrid rowClick="edit">
      <NumberField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <TextField source="ageGroup" label="Age Group" />
      <NumberField source="order" />
    </Datagrid>
  </List>
);

const TrackEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" disabled />
      <TextInput source="title" validate={required()} />
      <TextInput source="description" validate={required()} />
      <TextInput source="imageSrc" label="Image URL" validate={required()} />
      <SelectInput
        source="ageGroup"
        label="Age Group"
        choices={[
          { id: "ALL",    name: "All Ages" },
          { id: "KIDS",   name: "Kids (6–12)" },
          { id: "TEENS",  name: "Teens (13–17)" },
          { id: "ADULTS", name: "Adults (18+)" },
        ]}
        validate={required()}
      />
      <NumberInput source="order" validate={required()} />
    </SimpleForm>
  </Edit>
);

const TrackCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" validate={required()} />
      <TextInput source="description" validate={required()} />
      <TextInput source="imageSrc" label="Image URL" validate={required()} />
      <SelectInput
        source="ageGroup"
        label="Age Group"
        choices={[
          { id: "ALL",    name: "All Ages" },
          { id: "KIDS",   name: "Kids (6–12)" },
          { id: "TEENS",  name: "Teens (13–17)" },
          { id: "ADULTS", name: "Adults (18+)" },
        ]}
        validate={required()}
      />
      <NumberInput source="order" validate={required()} />
    </SimpleForm>
  </Create>
);

// ── Units ────────────────────────────────────────────────────────────────────

const UnitList = () => (
  <List>
    <Datagrid rowClick="edit">
      <NumberField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <ReferenceField source="trackId" reference="tracks" label="Track">
        <TextField source="title" />
      </ReferenceField>
      <NumberField source="order" />
    </Datagrid>
  </List>
);

const UnitEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" disabled />
      <TextInput source="title" validate={required()} />
      <TextInput source="description" validate={required()} />
      <ReferenceInput source="trackId" reference="tracks" label="Track">
        <SelectInput optionText="title" validate={required()} />
      </ReferenceInput>
      <NumberInput source="order" validate={required()} />
    </SimpleForm>
  </Edit>
);

const UnitCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" validate={required()} />
      <TextInput source="description" validate={required()} />
      <ReferenceInput source="trackId" reference="tracks" label="Track">
        <SelectInput optionText="title" validate={required()} />
      </ReferenceInput>
      <NumberInput source="order" validate={required()} />
    </SimpleForm>
  </Create>
);

// ── Lessons ──────────────────────────────────────────────────────────────────

const LessonList = () => (
  <List>
    <Datagrid rowClick="edit">
      <NumberField source="id" />
      <TextField source="title" />
      <ReferenceField source="unitId" reference="units" label="Unit">
        <TextField source="title" />
      </ReferenceField>
      <NumberField source="order" />
    </Datagrid>
  </List>
);

const LessonEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" disabled />
      <TextInput source="title" validate={required()} />
      <ReferenceInput source="unitId" reference="units" label="Unit">
        <SelectInput optionText="title" validate={required()} />
      </ReferenceInput>
      <NumberInput source="order" validate={required()} />
    </SimpleForm>
  </Edit>
);

const LessonCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" validate={required()} />
      <ReferenceInput source="unitId" reference="units" label="Unit">
        <SelectInput optionText="title" validate={required()} />
      </ReferenceInput>
      <NumberInput source="order" validate={required()} />
    </SimpleForm>
  </Create>
);

// ── Challenges ───────────────────────────────────────────────────────────────

const ChallengeList = () => (
  <List>
    <Datagrid rowClick="edit">
      <NumberField source="id" />
      <TextField source="question" />
      <TextField source="type" />
      <ReferenceField source="lessonId" reference="lessons" label="Lesson">
        <TextField source="title" />
      </ReferenceField>
      <NumberField source="order" />
    </Datagrid>
  </List>
);

const ChallengeEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" disabled />
      <TextInput source="question" validate={required()} fullWidth multiline />
      <SelectInput
        source="type"
        choices={[
          { id: "SELECT", name: "Multiple choice (SELECT)" },
          { id: "ASSIST", name: "Assisted (ASSIST)" },
        ]}
        validate={required()}
      />
      <ReferenceInput source="lessonId" reference="lessons" label="Lesson">
        <SelectInput optionText="title" validate={required()} />
      </ReferenceInput>
      <NumberInput source="order" validate={required()} />
    </SimpleForm>
  </Edit>
);

const ChallengeCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="question" validate={required()} fullWidth multiline />
      <SelectInput
        source="type"
        choices={[
          { id: "SELECT", name: "Multiple choice (SELECT)" },
          { id: "ASSIST", name: "Assisted (ASSIST)" },
        ]}
        validate={required()}
      />
      <ReferenceInput source="lessonId" reference="lessons" label="Lesson">
        <SelectInput optionText="title" validate={required()} />
      </ReferenceInput>
      <NumberInput source="order" validate={required()} />
    </SimpleForm>
  </Create>
);

// ── Challenge Options ─────────────────────────────────────────────────────────

const ChallengeOptionList = () => (
  <List>
    <Datagrid rowClick="edit">
      <NumberField source="id" />
      <TextField source="text" />
      <ReferenceField source="challengeId" reference="challenges" label="Challenge">
        <TextField source="question" />
      </ReferenceField>
      <SelectField
        source="correct"
        choices={[
          { id: true,  name: "✅ Correct" },
          { id: false, name: "❌ Wrong" },
        ]}
      />
    </Datagrid>
  </List>
);

const ChallengeOptionEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" disabled />
      <TextInput source="text" validate={required()} fullWidth />
      <ReferenceInput source="challengeId" reference="challenges" label="Challenge">
        <SelectInput optionText="question" validate={required()} />
      </ReferenceInput>
      <BooleanInput source="correct" label="This is the correct answer" />
      <TextInput source="imageSrc" label="Image URL (optional)" />
      <TextInput source="audioSrc" label="Audio URL (optional)" />
    </SimpleForm>
  </Edit>
);

const ChallengeOptionCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="text" validate={required()} fullWidth />
      <ReferenceInput source="challengeId" reference="challenges" label="Challenge">
        <SelectInput optionText="question" validate={required()} />
      </ReferenceInput>
      <BooleanInput source="correct" label="This is the correct answer" />
      <TextInput source="imageSrc" label="Image URL (optional)" />
      <TextInput source="audioSrc" label="Audio URL (optional)" />
    </SimpleForm>
  </Create>
);

// ── App ───────────────────────────────────────────────────────────────────────

const App = () => {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource
        name="tracks"
        list={TrackList}
        edit={TrackEdit}
        create={TrackCreate}
        recordRepresentation="title"
      />
      <Resource
        name="units"
        list={UnitList}
        edit={UnitEdit}
        create={UnitCreate}
        recordRepresentation="title"
      />
      <Resource
        name="lessons"
        list={LessonList}
        edit={LessonEdit}
        create={LessonCreate}
        recordRepresentation="title"
      />
      <Resource
        name="challenges"
        list={ChallengeList}
        edit={ChallengeEdit}
        create={ChallengeCreate}
        recordRepresentation="question"
      />
      <Resource
        name="challengeOptions"
        list={ChallengeOptionList}
        edit={ChallengeOptionEdit}
        create={ChallengeOptionCreate}
        recordRepresentation="text"
      />
    </Admin>
  );
};

export default App;
