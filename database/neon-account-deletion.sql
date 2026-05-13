CREATE OR REPLACE FUNCTION delete_user_account(target_user_id uuid)
RETURNS boolean AS $$
DECLARE
  target_role user_role;
BEGIN
  SELECT role
    INTO target_role
  FROM users
  WHERE id = target_user_id;

  IF target_role IS NULL THEN
    RETURN false;
  END IF;

  IF target_role = 'admin' THEN
    RAISE EXCEPTION 'La cuenta admin no se puede eliminar desde esta accion.';
  END IF;

  DELETE FROM support_ticket_messages WHERE sender_id = target_user_id;
  DELETE FROM review_replies WHERE author_id = target_user_id;
  DELETE FROM messages WHERE sender_id = target_user_id;
  DELETE FROM reports WHERE reporter_id = target_user_id;
  DELETE FROM support_tickets WHERE requester_id = target_user_id;

  IF target_role = 'client' THEN
    DELETE FROM bookings WHERE client_id = target_user_id;
    DELETE FROM reviews WHERE client_id = target_user_id;
  END IF;

  IF target_role = 'caregiver' THEN
    DELETE FROM bookings WHERE caregiver_id = target_user_id;
    DELETE FROM reviews WHERE caregiver_id = target_user_id;
  END IF;

  DELETE FROM users WHERE id = target_user_id;
  RETURN true;
END;
$$ LANGUAGE plpgsql;

