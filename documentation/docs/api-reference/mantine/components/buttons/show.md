---
id: show-button
title: Show
---

```tsx live shared
setRefineProps({
    Sider: () => null,
    Layout: RefineMantine.Layout,
    notificationProvider: RefineMantine.notificationProvider,
    catchAll: <RefineMantine.ErrorComponent />,
});

const Wrapper = ({ children }) => {
    return (
        <RefineMantine.MantineProvider
            theme={RefineMantine.LightTheme}
            withNormalizeCSS
            withGlobalStyles
        >
            <RefineMantine.Global
                styles={{ body: { WebkitFontSmoothing: "auto" } }}
            />
            <RefineMantine.NotificationsProvider position="top-right">
                {children}
            </RefineMantine.NotificationsProvider>
        </RefineMantine.MantineProvider>
    );
};
```

`<ShowButton>` uses Mantine [`<Button>`](https://mantine.dev/core/button/) component. It uses the `show` method from [`useNavigation`](/api-reference/core/hooks/navigation/useNavigation.md) under the hood. It can be useful when redirecting the app to the show page with the record id route of resource.

## Usage

```tsx live url=http://localhost:3000 previewHeight=420px hideCode
setInitialRoutes(["/posts"]);
import { Refine, useNavigation, useRouterContext } from "@pankod/refine-core";
import routerProvider from "@pankod/refine-react-router-v6";
import dataProvider from "@pankod/refine-simple-rest";
import { Button, Code, Space, Text } from "@pankod/refine-mantine";

// visible-block-start
import { List, Table, Pagination, ShowButton } from "@pankod/refine-mantine";
import { useTable, ColumnDef, flexRender } from "@pankod/refine-react-table";

const PostList: React.FC = () => {
    const columns = React.useMemo<ColumnDef<IPost>[]>(
        () => [
            {
                id: "id",
                header: "ID",
                accessorKey: "id",
            },
            {
                id: "title",
                header: "Title",
                accessorKey: "title",
            },
            {
                id: "actions",
                header: "Actions",
                accessorKey: "id",
                cell: function render({ getValue }) {
                    return (
                        // highlight-start
                        <ShowButton
                            size="xs"
                            recordItemId={getValue() as number}
                        />
                        // highlight-end
                    );
                },
            },
        ],
        [],
    );

    const {
        getHeaderGroups,
        getRowModel,
        refineCore: { setCurrent, pageCount, current },
    } = useTable({
        columns,
    });

    return (
        <List>
            <Table>
                <thead>
                    {getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
            <br />
            <Pagination
                position="right"
                total={pageCount}
                page={current}
                onChange={setCurrent}
            />
        </List>
    );
};

interface IPost {
    id: number;
    title: string;
}
// visible-block-end

const ShowPage = () => {
    const { list } = useNavigation();
    const params = useRouterContext().useParams();

    return (
        <div>
            <Text italic color="dimmed" size="sm">
                URL Parameters:
            </Text>
            <Code>{JSON.stringify(params)}</Code>
            <Space h="md" />
            <Button size="xs" variant="outline" onClick={() => list("posts")}>
                Go back
            </Button>
        </div>
    );
};

const App = () => {
    return (
        <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
            resources={[
                {
                    name: "posts",
                    list: PostList,
                    show: ShowPage,
                },
            ]}
        />
    );
};
render(
    <Wrapper>
        <App />
    </Wrapper>,
);
```

## Properties

### `recordItemId`

`recordItemId` is used to append the record id to the end of the route path.

```tsx live url=http://localhost:3000 previewHeight=200px
setInitialRoutes(["/"]);
import { Refine, useRouterContext, useNavigation } from "@pankod/refine-core";
import routerProvider from "@pankod/refine-react-router-v6";
import dataProvider from "@pankod/refine-simple-rest";
import { Button, Code, Space, Text } from "@pankod/refine-mantine";

// visible-block-start
import { ShowButton } from "@pankod/refine-mantine";

const MyShowComponent = () => {
    return <ShowButton recordItemId="123" />;
};
// visible-block-end

const ShowPage = () => {
    const { list } = useNavigation();
    const params = useRouterContext().useParams();

    return (
        <div>
            <Text italic color="dimmed" size="sm">
                URL Parameters:
            </Text>
            <Code>{JSON.stringify(params)}</Code>
            <Space h="md" />
            <Button size="xs" variant="outline" onClick={() => list("posts")}>
                Go back
            </Button>
        </div>
    );
};

const App = () => {
    return (
        <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
            resources={[
                {
                    name: "posts",
                    show: ShowPage,
                    list: MyShowComponent,
                },
            ]}
        />
    );
};

render(
    <Wrapper>
        <App />
    </Wrapper>,
);
```

Clicking the button will trigger the `show` method of [`useNavigation`](/api-reference/core/hooks/navigation/useNavigation.md) and then redirect the app to `/posts/show/123`.

:::note
`<ShowButton>` component reads the id information from the route by default.
:::

### `resourceNameOrRouteName`

Redirection endpoint(`resourceNameOrRouteName/show`) is defined by `resourceNameOrRouteName` property. By default, `<ShowButton>` uses `name` property of the resource object as an endpoint to redirect after clicking.

```tsx live url=http://localhost:3000 previewHeight=200px
setInitialRoutes(["/"]);

import { Refine, useRouterContext, useNavigation } from "@pankod/refine-core";
import routerProvider from "@pankod/refine-react-router-v6";
import dataProvider from "@pankod/refine-simple-rest";
import { Button, Code, Space, Text } from "@pankod/refine-mantine";

// visible-block-start
import { ShowButton } from "@pankod/refine-mantine";

const MyShowComponent = () => {
    return <ShowButton resourceNameOrRouteName="categories" recordItemId="2" />;
};
// visible-block-end

const ShowPage = () => {
    const { list } = useNavigation();
    const params = useRouterContext().useParams();

    return (
        <div>
            <Text italic color="dimmed" size="sm">
                URL Parameters:
            </Text>
            <Code>{JSON.stringify(params)}</Code>
            <Space h="md" />
            <Button size="xs" variant="outline" onClick={() => list("posts")}>
                Go back
            </Button>
        </div>
    );
};

const App = () => {
    return (
        <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
            resources={[
                {
                    name: "posts",
                    list: MyShowComponent,
                },
                {
                    name: "categories",
                    show: ShowPage,
                },
            ]}
        />
    );
};

render(
    <Wrapper>
        <App />
    </Wrapper>,
);
```

Clicking the button will trigger the `show` method of [`useNavigation`](/api-reference/core/hooks/navigation/useNavigation.md) and then redirect the app to `/categories/show/2`.

### `hideText`

It is used to show and not show the text of the button. When `true`, only the button icon is visible.

```tsx live url=http://localhost:3000 previewHeight=200px
setInitialRoutes(["/"]);

import { Refine, useRouterContext, useNavigation } from "@pankod/refine-core";
import routerProvider from "@pankod/refine-react-router-v6";
import dataProvider from "@pankod/refine-simple-rest";
import { Button, Code, Space, Text } from "@pankod/refine-mantine";

// visible-block-start
import { ShowButton } from "@pankod/refine-mantine";

const MyShowComponent = () => {
    return <ShowButton recordItemId="123" hideText />;
};
// visible-block-end

const ShowPage = () => {
    const { list } = useNavigation();
    const params = useRouterContext().useParams();

    return (
        <div>
            <Text italic color="dimmed" size="sm">
                URL Parameters:
            </Text>
            <Code>{JSON.stringify(params)}</Code>
            <Space h="md" />
            <Button size="xs" variant="outline" onClick={() => list("posts")}>
                Go back
            </Button>
        </div>
    );
};

const App = () => {
    return (
        <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
            resources={[
                {
                    name: "posts",
                    list: MyShowComponent,
                    show: ShowPage,
                },
            ]}
        />
    );
};

render(
    <Wrapper>
        <App />
    </Wrapper>,
);
```

### `ignoreAccessControlProvider`

It is used to skip access control for the button so that it doesn't check for access control. This is relevant only when an [`accessControlProvider`](/api-reference/core/providers/accessControl-provider.md) is provided to [`<Refine/>`](/api-reference/core/components/refine-config.md)

```tsx
import { ShowButton } from "@pankod/refine-mantine";

export const MyShowComponent = () => {
    return <ShowButton ignoreAccessControlProvider />;
};
```

## API Reference

### Properties

<PropsTable module="@pankod/refine-mantine/ShowButton" />
