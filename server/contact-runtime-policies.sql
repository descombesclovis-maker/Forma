-- Apply once as the table owner after creating forma_contact_app and the contact tables.
begin;
alter table forma_contact.requests enable row level security;
alter table forma_contact.notifications enable row level security;

create policy contact_app_read_requests on forma_contact.requests
  for select to forma_contact_app using (true);
create policy contact_app_insert_requests on forma_contact.requests
  for insert to forma_contact_app with check (true);

create policy contact_app_read_notifications on forma_contact.notifications
  for select to forma_contact_app using (true);
create policy contact_app_insert_notifications on forma_contact.notifications
  for insert to forma_contact_app with check (true);
create policy contact_app_update_notifications on forma_contact.notifications
  for update to forma_contact_app using (true) with check (true);
commit;
