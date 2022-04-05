import { useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "../../lib/UserProvider";
import { CREATE_CATALOGUE, MY_CATALOGUES } from "../../graphql/schemas";
import { apolloHookErrorHandler } from "../../utils/functions";

type Props = {
  className?: string;
  simpleText?: boolean;
  children?: React.ReactNode;
};
const CreateCatalogueButton = ({
  className,
  children,
}: Props): React.ReactElement => {
  const { cache } = useUser();
  const [createCatalogue, { loading, data, error }] =
    useMutation(CREATE_CATALOGUE);
  apolloHookErrorHandler("CreateCatalogueButton.tsx", error);
  const router = useRouter();
  useEffect(() => {
    if (!loading && data) {
      cache.updateQuery({ query: MY_CATALOGUES }, (prev) => {
        return {
          myCatalogues: [...prev.myCatalogues, data.createCatalogue],
        };
      });
      router.push("/ctg/" + data.createCatalogue.id);
    }
  }, [loading, data]);

  const handleClick = async () => {
    createCatalogue();
  };

  if (children) {
    return (
      <div onClick={handleClick} className={className}>
        {children}
      </div>
    );
  }

  return (
    <button onClick={handleClick} className={`btn ${className}`}>
      Create a List
    </button>
  );
};

export default CreateCatalogueButton;
