# Where we are going

## Evaluate puer

We are currently using puer. Though we only use the live-reload feature of it and it prevents us from programatically testing the server. For these reasons it might be good to move away from it.

## no more allRoutes

This is a remainder from the prototypical phase of this project. As such it should be removed.

Instead we should:
- load files
- update the routes in the store related to them

We keep a mocking store ourselves anyway. This would basically get rid of the preprocessing step.

## Catch ajax requests

In production you might want to request `company.com/something`. It would be awesome if users could set up a route for that and we catch those requests and mock them as well.

## test everything

See the problems with puer keeping us from doing so.

Maybe nicer output would be nice as well.
