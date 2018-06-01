export function getFullNameFromUserObject(person) {
  const firstName = person.first_name && person.first_name.toLowerCase();
  const lastName = person.last_name && person.last_name.toLowerCase();
  const fullName = firstName ? `${firstName} ${lastName}` : lastName;
  return fullName;
}
